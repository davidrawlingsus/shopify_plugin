/**
 * Session Replay Web Pixel Extension
 * Captures user interactions for session replay functionality
 */

class SessionReplayPixel {
  constructor() {
    this.sessionKey = this.generateSessionKey();
    this.eventBuffer = [];
    this.isRecording = false;
    this.batchSize = 50;
    this.batchTimeout = 5000;
    this.lastBatchTime = Date.now();
    
    // Settings from Shopify admin
    this.settings = {
      apiEndpoint: 'https://your-app-url.com/api/events',
      batchSize: 50,
      batchTimeout: 5000,
      enableMouseTracking: true,
      enableScrollTracking: true,
      enableFormTracking: true,
      maskSensitiveData: true
    };

    this.init();
  }

  generateSessionKey() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  init() {
    // Store session key globally for survey correlation
    window.sessionKey = this.sessionKey;
    
    // Check if we should start recording based on consent
    if (this.shouldStartRecording()) {
      this.startRecording();
    }

    // Listen for consent changes
    this.setupConsentListener();
  }

  shouldStartRecording() {
    // Check Shopify's consent system
    return window.Shopify && 
           window.Shopify.customerPrivacy && 
           window.Shopify.customerPrivacy.getTrackingConsent &&
           window.Shopify.customerPrivacy.getTrackingConsent().marketing;
  }

  setupConsentListener() {
    if (window.Shopify && window.Shopify.customerPrivacy) {
      window.Shopify.customerPrivacy.onTrackingConsentChanged(() => {
        if (this.shouldStartRecording() && !this.isRecording) {
          this.startRecording();
        } else if (!this.shouldStartRecording() && this.isRecording) {
          this.stopRecording();
        }
      });
    }
  }

  startRecording() {
    if (this.isRecording) return;
    
    this.isRecording = true;
    console.log('Session replay recording started');

    // Record initial page state
    this.recordEvent({
      type: 'page_load',
      timestamp: Date.now(),
      url: window.location.href,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });

    // Set up event listeners
    this.setupEventListeners();
    
    // Start batch processing
    this.startBatchProcessor();
  }

  stopRecording() {
    if (!this.isRecording) return;
    
    this.isRecording = false;
    console.log('Session replay recording stopped');

    // Remove event listeners
    this.removeEventListeners();
    
    // Send any remaining events
    this.flushBuffer();
  }

  setupEventListeners() {
    // Mouse events
    if (this.settings.enableMouseTracking) {
      this.addThrottledListener('mousemove', this.handleMouseMove.bind(this));
      this.addThrottledListener('mousedown', this.handleMouseDown.bind(this));
      this.addThrottledListener('mouseup', this.handleMouseUp.bind(this));
      this.addThrottledListener('click', this.handleClick.bind(this));
    }

    // Scroll events
    if (this.settings.enableScrollTracking) {
      this.addThrottledListener('scroll', this.handleScroll.bind(this));
    }

    // Form events
    if (this.settings.enableFormTracking) {
      this.addThrottledListener('input', this.handleInput.bind(this));
      this.addThrottledListener('change', this.handleChange.bind(this));
      this.addThrottledListener('focus', this.handleFocus.bind(this));
      this.addThrottledListener('blur', this.handleBlur.bind(this));
    }

    // Window events
    this.addListener('resize', this.handleResize.bind(this));
    this.addListener('beforeunload', this.handleBeforeUnload.bind(this));
  }

  removeEventListeners() {
    // Remove all event listeners
    window.removeEventListener('mousemove', this.throttledMouseMove);
    window.removeEventListener('mousedown', this.throttledMouseDown);
    window.removeEventListener('mouseup', this.throttledMouseUp);
    window.removeEventListener('click', this.throttledClick);
    window.removeEventListener('scroll', this.throttledScroll);
    window.removeEventListener('input', this.throttledInput);
    window.removeEventListener('change', this.throttledChange);
    window.removeEventListener('focus', this.throttledFocus);
    window.removeEventListener('blur', this.throttledBlur);
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  }

  addThrottledListener(event, handler, delay = 100) {
    const throttledHandler = this.throttle(handler, delay);
    window.addEventListener(event, throttledHandler);
    this[`throttled${event.charAt(0).toUpperCase() + event.slice(1)}`] = throttledHandler;
  }

  addListener(event, handler) {
    window.addEventListener(event, handler);
  }

  throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    
    return function (...args) {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }

  // Event handlers
  handleMouseMove(event) {
    this.recordEvent({
      type: 'mouse_move',
      timestamp: Date.now(),
      x: event.clientX,
      y: event.clientY,
      target: this.getElementSelector(event.target)
    });
  }

  handleMouseDown(event) {
    this.recordEvent({
      type: 'mouse_down',
      timestamp: Date.now(),
      x: event.clientX,
      y: event.clientY,
      button: event.button,
      target: this.getElementSelector(event.target)
    });
  }

  handleMouseUp(event) {
    this.recordEvent({
      type: 'mouse_up',
      timestamp: Date.now(),
      x: event.clientX,
      y: event.clientY,
      button: event.button,
      target: this.getElementSelector(event.target)
    });
  }

  handleClick(event) {
    this.recordEvent({
      type: 'click',
      timestamp: Date.now(),
      x: event.clientX,
      y: event.clientY,
      target: this.getElementSelector(event.target),
      text: event.target.textContent?.slice(0, 100)
    });
  }

  handleScroll(event) {
    this.recordEvent({
      type: 'scroll',
      timestamp: Date.now(),
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      target: this.getElementSelector(event.target)
    });
  }

  handleInput(event) {
    const value = this.settings.maskSensitiveData ? 
      this.maskSensitiveData(event.target.value, event.target) : 
      event.target.value;

    this.recordEvent({
      type: 'input',
      timestamp: Date.now(),
      target: this.getElementSelector(event.target),
      value: value,
      inputType: event.inputType
    });
  }

  handleChange(event) {
    const value = this.settings.maskSensitiveData ? 
      this.maskSensitiveData(event.target.value, event.target) : 
      event.target.value;

    this.recordEvent({
      type: 'change',
      timestamp: Date.now(),
      target: this.getElementSelector(event.target),
      value: value
    });
  }

  handleFocus(event) {
    this.recordEvent({
      type: 'focus',
      timestamp: Date.now(),
      target: this.getElementSelector(event.target)
    });
  }

  handleBlur(event) {
    this.recordEvent({
      type: 'blur',
      timestamp: Date.now(),
      target: this.getElementSelector(event.target)
    });
  }

  handleResize(event) {
    this.recordEvent({
      type: 'resize',
      timestamp: Date.now(),
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  handleBeforeUnload(event) {
    this.recordEvent({
      type: 'page_unload',
      timestamp: Date.now()
    });
    
    // Send final batch synchronously
    this.flushBuffer(true);
  }

  // Utility functions
  getElementSelector(element) {
    if (!element || element === document) return 'document';
    
    let selector = '';
    let current = element;
    
    while (current && current !== document.body) {
      let part = current.tagName.toLowerCase();
      
      if (current.id) {
        part += `#${current.id}`;
        selector = part + (selector ? ' > ' + selector : '');
        break;
      } else if (current.className) {
        part += `.${current.className.split(' ').join('.')}`;
      }
      
      selector = part + (selector ? ' > ' + selector : '');
      current = current.parentElement;
    }
    
    return selector;
  }

  maskSensitiveData(value, element) {
    if (!value || !element) return value;
    
    const tagName = element.tagName?.toLowerCase();
    const type = element.type?.toLowerCase();
    const name = element.name?.toLowerCase();
    const id = element.id?.toLowerCase();
    
    // Check for sensitive field patterns
    const sensitivePatterns = [
      'email', 'password', 'credit', 'card', 'cvv', 'cvc', 'ssn', 'social',
      'phone', 'address', 'zip', 'postal'
    ];
    
    const isSensitive = sensitivePatterns.some(pattern => 
      tagName?.includes(pattern) ||
      type?.includes(pattern) ||
      name?.includes(pattern) ||
      id?.includes(pattern)
    );
    
    if (isSensitive && value.length > 0) {
      return '•••••';
    }
    
    return value;
  }

  recordEvent(event) {
    if (!this.isRecording) return;
    
    this.eventBuffer.push({
      ...event,
      sessionKey: this.sessionKey,
      url: window.location.href,
      timestamp: Date.now()
    });
    
    // Check if we should send a batch
    if (this.eventBuffer.length >= this.batchSize) {
      this.flushBuffer();
    }
  }

  startBatchProcessor() {
    setInterval(() => {
      const now = Date.now();
      if (now - this.lastBatchTime >= this.batchTimeout && this.eventBuffer.length > 0) {
        this.flushBuffer();
      }
    }, this.batchTimeout);
  }

  flushBuffer(sync = false) {
    if (this.eventBuffer.length === 0) return;
    
    const events = [...this.eventBuffer];
    this.eventBuffer = [];
    this.lastBatchTime = Date.now();
    
    this.sendEvents(events, sync);
  }

  sendEvents(events, sync = false) {
    const payload = {
      sessionKey: this.sessionKey,
      events: events,
      metadata: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now(),
        shopDomain: window.Shopify?.shop || 'unknown'
      }
    };

    if (sync) {
      // Send synchronously for page unload
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', this.settings.apiEndpoint, false);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(payload));
      } catch (error) {
        console.error('Error sending events synchronously:', error);
      }
    } else {
      // Send asynchronously
      fetch(this.settings.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }).catch(error => {
        console.error('Error sending events:', error);
      });
    }
  }
}

// Initialize the pixel when the script loads
if (typeof window !== 'undefined') {
  window.sessionReplayPixel = new SessionReplayPixel();
}

// Export for Shopify's pixel system
export default function(event) {
  // This function is called by Shopify's pixel system
  // We can use it to initialize or handle specific Shopify events
  if (event && event.type === 'page_view') {
    console.log('Shopify page view event received');
  }
}

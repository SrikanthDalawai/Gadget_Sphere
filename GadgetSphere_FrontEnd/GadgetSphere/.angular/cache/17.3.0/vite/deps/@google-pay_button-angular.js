import {
  Directive,
  ElementRef,
  Input,
  NgModule,
  __async,
  __spreadProps,
  __spreadValues,
  setClassMetadata,
  ɵɵNgOnChangesFeature,
  ɵɵdefineDirective,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject
} from "./chunk-TS4SE3V6.js";

// node_modules/@google-pay/button-angular/fesm2020/google-pay-button-angular.mjs
var cachedScripts = {};
function loadScript(src) {
  const existing = cachedScripts[src];
  if (existing) {
    return existing;
  }
  const promise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    const onScriptLoad = () => {
      resolve();
    };
    const onScriptError = () => {
      cleanup();
      delete cachedScripts[src];
      script.remove();
      reject(new Error(`Unable to load script ${src}`));
    };
    script.addEventListener("load", onScriptLoad);
    script.addEventListener("error", onScriptError);
    document.body.appendChild(script);
    function cleanup() {
      script.removeEventListener("load", onScriptLoad);
      script.removeEventListener("error", onScriptError);
    }
  });
  cachedScripts[src] = promise;
  return promise;
}
var ButtonManager = class {
  constructor(options) {
    this.handleClick = (event) => __async(this, null, function* () {
      const config = this.config;
      if (!config) {
        throw new Error("google-pay-button: Missing configuration");
      }
      const request = this.createLoadPaymentDataRequest(config);
      try {
        if (config.onClick) {
          config.onClick(event);
        }
        if (event.defaultPrevented) {
          return;
        }
        const result = yield this.client.loadPaymentData(request);
        if (config.onLoadPaymentData) {
          config.onLoadPaymentData(result);
        }
      } catch (err) {
        if (err.statusCode === "CANCELED") {
          if (config.onCancel) {
            config.onCancel(err);
          }
        } else if (config.onError) {
          config.onError(err);
        } else {
          console.error(err);
        }
      }
    });
    this.options = options;
  }
  getElement() {
    return this.element;
  }
  isGooglePayLoaded() {
    return "google" in (window || global) && !!google?.payments?.api?.PaymentsClient;
  }
  mount(element) {
    return __async(this, null, function* () {
      if (!this.isGooglePayLoaded()) {
        try {
          yield loadScript("https://pay.google.com/gp/p/js/pay.js");
        } catch (err) {
          if (this.config?.onError) {
            this.config.onError(err);
          } else {
            console.error(err);
          }
          return;
        }
      }
      this.element = element;
      if (element) {
        this.appendStyles();
        if (this.config) {
          this.updateElement();
        }
      }
    });
  }
  unmount() {
    this.element = void 0;
  }
  configure(newConfig) {
    let promise = void 0;
    this.config = newConfig;
    if (!this.oldInvalidationValues || this.isClientInvalidated(newConfig)) {
      promise = this.updateElement();
    }
    this.oldInvalidationValues = this.getInvalidationValues(newConfig);
    return promise ?? Promise.resolve();
  }
  /**
   * Creates client configuration options based on button configuration
   * options.
   *
   * This method would normally be private but has been made public for
   * testing purposes.
   *
   * @private
   */
  createClientOptions(config) {
    const clientConfig = {
      environment: config.environment,
      merchantInfo: this.createMerchantInfo(config)
    };
    if (config.onPaymentDataChanged || config.onPaymentAuthorized) {
      clientConfig.paymentDataCallbacks = {};
      if (config.onPaymentDataChanged) {
        clientConfig.paymentDataCallbacks.onPaymentDataChanged = (paymentData) => {
          const result = config.onPaymentDataChanged(paymentData);
          return result || {};
        };
      }
      if (config.onPaymentAuthorized) {
        clientConfig.paymentDataCallbacks.onPaymentAuthorized = (paymentData) => {
          const result = config.onPaymentAuthorized(paymentData);
          return result || {};
        };
      }
    }
    return clientConfig;
  }
  createIsReadyToPayRequest(config) {
    const paymentRequest = config.paymentRequest;
    const request = {
      apiVersion: paymentRequest.apiVersion,
      apiVersionMinor: paymentRequest.apiVersionMinor,
      allowedPaymentMethods: paymentRequest.allowedPaymentMethods,
      existingPaymentMethodRequired: config.existingPaymentMethodRequired
    };
    return request;
  }
  /**
   * Constructs `loadPaymentData` request object based on button configuration.
   *
   * It infers request properties like `shippingAddressRequired`,
   * `shippingOptionRequired`, and `billingAddressRequired` if not already set
   * based on the presence of their associated options and parameters. It also
   * infers `callbackIntents` based on the callback methods defined in button
   * configuration.
   *
   * This method would normally be private but has been made public for
   * testing purposes.
   *
   * @private
   */
  createLoadPaymentDataRequest(config) {
    const request = __spreadProps(__spreadValues({}, config.paymentRequest), {
      merchantInfo: this.createMerchantInfo(config)
    });
    return request;
  }
  createMerchantInfo(config) {
    const merchantInfo = __spreadValues({}, config.paymentRequest.merchantInfo);
    if (!merchantInfo.softwareInfo) {
      merchantInfo.softwareInfo = {
        id: this.options.softwareInfoId,
        version: this.options.softwareInfoVersion
      };
    }
    return merchantInfo;
  }
  isMounted() {
    return this.element != null && this.element.isConnected !== false;
  }
  removeButton() {
    if (this.element instanceof ShadowRoot || this.element instanceof Element) {
      for (const child of Array.from(this.element.children)) {
        if (child.tagName !== "STYLE") {
          child.remove();
        }
      }
    }
  }
  updateElement() {
    return __async(this, null, function* () {
      if (!this.isMounted())
        return;
      const element = this.getElement();
      if (!this.config) {
        throw new Error("google-pay-button: Missing configuration");
      }
      this.removeButton();
      try {
        this.client = new google.payments.api.PaymentsClient(this.createClientOptions(this.config));
      } catch (err) {
        if (this.config.onError) {
          this.config.onError(err);
        } else {
          console.error(err);
        }
        return;
      }
      const buttonOptions = {
        buttonType: this.config.buttonType,
        buttonColor: this.config.buttonColor,
        buttonRadius: this.config.buttonRadius,
        buttonSizeMode: this.config.buttonSizeMode,
        buttonLocale: this.config.buttonLocale,
        onClick: this.handleClick,
        allowedPaymentMethods: this.config.paymentRequest.allowedPaymentMethods
      };
      const rootNode = element.getRootNode();
      if (rootNode instanceof ShadowRoot) {
        buttonOptions.buttonRootNode = rootNode;
      }
      const button = this.client.createButton(buttonOptions);
      this.setClassName(element, [element.className, "not-ready"]);
      element.appendChild(button);
      let showButton = false;
      let readyToPay;
      try {
        readyToPay = yield this.client.isReadyToPay(this.createIsReadyToPayRequest(this.config));
        showButton = readyToPay.result && !this.config.existingPaymentMethodRequired || readyToPay.result && readyToPay.paymentMethodPresent && this.config.existingPaymentMethodRequired || false;
      } catch (err) {
        if (this.config.onError) {
          this.config.onError(err);
        } else {
          console.error(err);
        }
      }
      if (!this.isMounted())
        return;
      if (showButton) {
        try {
          this.client.prefetchPaymentData(this.createLoadPaymentDataRequest(this.config));
        } catch (err) {
          console.log("Error with prefetch", err);
        }
        this.setClassName(element, (element.className || "").split(" ").filter((className) => className && className !== "not-ready"));
      }
      if (this.isReadyToPay !== readyToPay?.result || this.paymentMethodPresent !== readyToPay?.paymentMethodPresent) {
        this.isReadyToPay = !!readyToPay?.result;
        this.paymentMethodPresent = readyToPay?.paymentMethodPresent;
        if (this.config.onReadyToPayChange) {
          const readyToPayResponse = {
            isButtonVisible: showButton,
            isReadyToPay: this.isReadyToPay
          };
          if (this.paymentMethodPresent) {
            readyToPayResponse.paymentMethodPresent = this.paymentMethodPresent;
          }
          this.config.onReadyToPayChange(readyToPayResponse);
        }
      }
    });
  }
  setClassName(element, classNames) {
    const className = classNames.filter((name2) => name2).join(" ");
    if (className) {
      element.className = className;
    } else {
      element.removeAttribute("class");
    }
  }
  appendStyles() {
    if (typeof document === "undefined")
      return;
    const rootNode = this.element?.getRootNode();
    const styleId = `default-google-style-${this.options.cssSelector.replace(/[^\w-]+/g, "")}-${this.config?.buttonLocale}`;
    if (rootNode) {
      if (!rootNode.getElementById?.(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.type = "text/css";
        style.innerHTML = `
          ${this.options.cssSelector} {
            display: inline-block;
          }
          ${this.options.cssSelector}.not-ready {
            width: 0;
            height: 0;
            overflow: hidden;
          }
        `;
        if (rootNode instanceof Document && rootNode.head) {
          rootNode.head.appendChild(style);
        } else {
          rootNode.appendChild(style);
        }
      }
    }
  }
  isClientInvalidated(newConfig) {
    if (!this.oldInvalidationValues)
      return true;
    const newValues = this.getInvalidationValues(newConfig);
    return newValues.some((value, index) => JSON.stringify(value) !== JSON.stringify(this.oldInvalidationValues[index]));
  }
  getInvalidationValues(config) {
    return [config.environment, config.existingPaymentMethodRequired, !!config.onPaymentDataChanged, !!config.onPaymentAuthorized, config.buttonType, config.buttonColor, config.buttonRadius, config.buttonLocale, config.buttonSizeMode, config.paymentRequest.merchantInfo.merchantId, config.paymentRequest.merchantInfo.merchantName, config.paymentRequest.merchantInfo.softwareInfo?.id, config.paymentRequest.merchantInfo.softwareInfo?.version, config.paymentRequest.allowedPaymentMethods];
  }
};
var name = "@google-pay/button-angular";
var version = "3.1.0";
function debounce(func, wait = 0) {
  let timeout;
  return function(...args) {
    window.clearTimeout(timeout);
    const later = function() {
      timeout = void 0;
      return func(...args);
    };
    return new Promise((resolve) => {
      timeout = window.setTimeout(() => {
        const result = later();
        resolve(result);
      }, wait);
    });
  };
}
var GooglePayButtonComponent = class {
  constructor(elementRef) {
    this.elementRef = elementRef;
    this.manager = new ButtonManager({
      cssSelector: "google-pay-button",
      softwareInfoId: name,
      softwareInfoVersion: version
    });
    this.initializeButton = debounce(() => {
      if (!this.assertRequiredProperty("paymentRequest")) {
        return;
      }
      if (!this.assertRequiredProperty("environment")) {
        return;
      }
      const config = {
        paymentRequest: this.paymentRequest,
        environment: this.environment,
        existingPaymentMethodRequired: this.existingPaymentMethodRequired,
        onPaymentDataChanged: this.paymentDataChangedCallback,
        onPaymentAuthorized: this.paymentAuthorizedCallback,
        buttonColor: this.buttonColor,
        buttonType: this.buttonType,
        buttonRadius: this.buttonRadius,
        buttonSizeMode: this.buttonSizeMode,
        buttonLocale: this.buttonLocale,
        onReadyToPayChange: (result) => {
          if (this.readyToPayChangeCallback) {
            this.readyToPayChangeCallback(result);
          }
          this.dispatch("readytopaychange", result);
        },
        onCancel: (reason) => {
          if (this.cancelCallback) {
            this.cancelCallback(reason);
          }
          this.dispatch("cancel", reason);
        },
        onError: (error) => {
          if (this.errorCallback) {
            this.errorCallback?.(error);
          }
          this.elementRef.nativeElement.dispatchEvent(new ErrorEvent("error", {
            error
          }));
        },
        onLoadPaymentData: (paymentData) => {
          if (this.loadPaymentDataCallback) {
            this.loadPaymentDataCallback(paymentData);
          }
          this.dispatch("loadpaymentdata", paymentData);
        },
        onClick: (event) => {
          if (this.clickCallback) {
            this.clickCallback?.(event);
          }
        }
      };
      this.manager.configure(config);
    });
  }
  get isReadyToPay() {
    return this.manager.isReadyToPay;
  }
  ngOnInit() {
    return this.manager.mount(this.elementRef.nativeElement);
  }
  ngOnChanges() {
    return this.initializeButton();
  }
  assertRequiredProperty(name2) {
    const value = this[name2];
    if (value === null || value === void 0) {
      this.throwError(Error(`Required property not set: ${name2}`));
      return false;
    }
    return true;
  }
  /**
   * Throws an error.
   *
   * Used for testing purposes so that the method can be spied on.
   */
  throwError(error) {
    throw error;
  }
  dispatch(type, detail) {
    this.elementRef.nativeElement.dispatchEvent(new CustomEvent(type, {
      bubbles: true,
      cancelable: false,
      detail
    }));
  }
};
GooglePayButtonComponent.ɵfac = function GooglePayButtonComponent_Factory(t) {
  return new (t || GooglePayButtonComponent)(ɵɵdirectiveInject(ElementRef));
};
GooglePayButtonComponent.ɵdir = ɵɵdefineDirective({
  type: GooglePayButtonComponent,
  selectors: [["google-pay-button"]],
  inputs: {
    paymentRequest: "paymentRequest",
    environment: "environment",
    existingPaymentMethodRequired: "existingPaymentMethodRequired",
    buttonColor: "buttonColor",
    buttonType: "buttonType",
    buttonRadius: "buttonRadius",
    buttonSizeMode: "buttonSizeMode",
    buttonLocale: "buttonLocale",
    paymentDataChangedCallback: "paymentDataChangedCallback",
    paymentAuthorizedCallback: "paymentAuthorizedCallback",
    readyToPayChangeCallback: "readyToPayChangeCallback",
    loadPaymentDataCallback: "loadPaymentDataCallback",
    cancelCallback: "cancelCallback",
    errorCallback: "errorCallback",
    clickCallback: "clickCallback"
  },
  features: [ɵɵNgOnChangesFeature]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GooglePayButtonComponent, [{
    type: Directive,
    args: [{
      selector: "google-pay-button"
    }]
  }], function() {
    return [{
      type: ElementRef
    }];
  }, {
    paymentRequest: [{
      type: Input
    }],
    environment: [{
      type: Input
    }],
    existingPaymentMethodRequired: [{
      type: Input
    }],
    buttonColor: [{
      type: Input
    }],
    buttonType: [{
      type: Input
    }],
    buttonRadius: [{
      type: Input
    }],
    buttonSizeMode: [{
      type: Input
    }],
    buttonLocale: [{
      type: Input
    }],
    paymentDataChangedCallback: [{
      type: Input
    }],
    paymentAuthorizedCallback: [{
      type: Input
    }],
    readyToPayChangeCallback: [{
      type: Input
    }],
    loadPaymentDataCallback: [{
      type: Input
    }],
    cancelCallback: [{
      type: Input
    }],
    errorCallback: [{
      type: Input
    }],
    clickCallback: [{
      type: Input
    }]
  });
})();
var GooglePayButtonModule = class {
};
GooglePayButtonModule.ɵfac = function GooglePayButtonModule_Factory(t) {
  return new (t || GooglePayButtonModule)();
};
GooglePayButtonModule.ɵmod = ɵɵdefineNgModule({
  type: GooglePayButtonModule,
  declarations: [GooglePayButtonComponent],
  exports: [GooglePayButtonComponent]
});
GooglePayButtonModule.ɵinj = ɵɵdefineInjector({});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GooglePayButtonModule, [{
    type: NgModule,
    args: [{
      declarations: [GooglePayButtonComponent],
      imports: [],
      exports: [GooglePayButtonComponent]
    }]
  }], null, null);
})();
export {
  GooglePayButtonComponent,
  GooglePayButtonModule
};
//# sourceMappingURL=@google-pay_button-angular.js.map

import "electron";

interface WebViewProps {
  is?: boolean;
  src?: string;
  preload?: string;
  plugins?: string;
  partition?: string;
  sandbox?: boolean;
  ref?: (wv: Electron.WebviewTag) => void;
}

// tslint:disable-next-line
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "webview": WebViewProps;
    }
  }
}

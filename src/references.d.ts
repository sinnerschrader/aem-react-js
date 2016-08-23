// globals
declare var i18n: any;

interface Window {
  React: any;
  ReactComponents: {
    [name: string]: any
  };
  initReactComponents(): void;
}

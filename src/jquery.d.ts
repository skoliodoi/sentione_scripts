import jQuery from 'jquery';

declare global {
  interface GlobalThis {
    $: typeof jQuery;
    jQuery: typeof jQuery;
  }
  
  interface Window {
    $: typeof jQuery;
    jQuery: typeof jQuery;
  }
}
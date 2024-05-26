import { CrmLayout } from "@/crm/Layout";
import { store } from "@/stores/store";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Provider store={store}>
    <CrmLayout>
      <Component {...pageProps} />
    </CrmLayout>
  </Provider>
}

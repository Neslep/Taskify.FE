import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PaymentView } from 'src/sections/payment';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Payment - ${CONFIG.appName}`}</title>
      </Helmet>

      <PaymentView />
    </>
  );
}

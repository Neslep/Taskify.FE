import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UserView } from 'src/sections/userProject/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Projects - ${CONFIG.appName}`}</title>
      </Helmet>

      <UserView />
    </>
  );
}

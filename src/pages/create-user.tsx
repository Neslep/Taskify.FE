import { Helmet } from "react-helmet-async";

import { CONFIG } from "src/config-global";

import { CreateUserView } from "src/sections/auth/create-user-view";

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Create User - ${CONFIG.appName}`}</title>
      </Helmet>

      <CreateUserView />
    </>
  );
}

import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ProjectDetailView } from 'src/sections/userProject/projectDetail/view';



// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Projects Detail - ${CONFIG.appName}`}</title>
      </Helmet>

      <ProjectDetailView />
    </>
  );
}

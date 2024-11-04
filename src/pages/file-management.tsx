import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import FileManagement from 'src/sections/fileManagement/fileManagement';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`File Management - ${CONFIG.appName}`}</title>
      </Helmet>

      <FileManagement />
    </>
  );
}

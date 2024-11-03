import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { KanbanView } from 'src/sections/kanban/kanban-view';



// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Kanban - ${CONFIG.appName}`}</title>
      </Helmet>

      <KanbanView />
    </>
  );
}

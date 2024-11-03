import { Helmet } from 'react-helmet-async';
import { CONFIG } from '../config-global';
import CalendarView from '../sections/Calendar/CalendarView';


export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Calendar - ${CONFIG.appName}`}</title>
      </Helmet>

      <CalendarView />
    </>
  );
}
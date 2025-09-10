import { useSidebarStore } from '../store';
import './Sidebar.css';

export default function Sidebar() {
  const { isOpenSidebar } = useSidebarStore();

  return (
    <div className=" Sidebar h-full z-80">
      {/* Sidebar */}
      <aside
        className={`${isOpenSidebar ? 'isOpenSidebar' : ''} w-full h-full flex-shrink-0 
        `}
      >
        {isOpenSidebar && (
          <div className="flex relative flex-col h-full">
            <span className="sound-code absolute top-0 right-0">SWE-001</span>
            {/* Header */}
            <header className="flex text-sm">
              <div className="meta-data">
                <p className="font-semibold">Meta A</p>
                <p className="text-gray-500">Detail A</p>
              </div>
              <div className="meta-data ml-4">
                <p className="font-semibold">Meta B</p>
                <p className="text-gray-500">Detail B</p>
              </div>
            </header>
            <hr></hr>

            {/* Scrollable content */}
            <div className="content flex-1 overflow-y-auto space-y-4">
              <p>
                Sweden’s outdoor warning (Viktigt meddelande till allmänheten, VMA—“Hesa Fredrik”)
                descends from interwar/WWII air-raid practice (first public tests in 1931) and was
                later codified for uniform recognition. The legal baseline comes from the
                Civilförsvarskungörelse (1960:377), which specifies VMA as “upprepade långa
                ljudsegment (6–7 sekunder) åtskilda av pauser (12–14 sekunder)” and that the signal
                “skall omfatta minst sex ljudsegment” (official statute text, Riksdagen)
                (Försvarsmakten history page on “Hesa Fredrik”, forsvarsmakten.se;
                Civilförsvarskungörelse (1960:377), riksdagen.se / lagen.nu). The same framework
                differentiates VMA from the war-time flyglarm (2 s on / 2 s off for 1 min) and
                beredskapslarm (30 s on / 15 s off for 5 min), giving each alert a distinct acoustic
                “fingerprint” (MSB and Krisinformation pages) (msb.se;
                krisinformation.se).\nOperational guidance today reinforces that distinctiveness is
                the point: VMA is always sent with this exact 7 s/14 s interval, and if you hear
                something similar but not in that pattern, it’s likely another system (MSB
                “Utomhusvarning – Hesa Fredrik,” “Falsklarm”) (msb.se). The signal runs for about
                two minutes (six cycles) and is followed by “Faran över” (≈30 s steady) once the
                danger has passed; quarterly tests at 15:00 on the first non-holiday Monday of
                March/June/September/December maintain public recognition (MSB; Krisinformation; MSB
                brochures) (msb.se; krisinformation.se; MSB brochure “In case of crisis or war,”
                rib.msb.se). In short, while no official document spells out why “7 and 14” were
                chosen, the legal standardization from 1960 and current guidance show the rationale
                is uniform, unmistakable recognition and separation from other alarms so people
                immediately shelter and tune to SR P4 for instructions (riksdagen.se; msb.se;
                krisinformation.se).\nSources: Försvarsmakten history of “Hesa Fredrik”
                (forsvarsmakten.se); Civilförsvarskungörelse (1960:377) statute text (riksdagen.se;
                lagen.nu); MSB VMA & outdoor warning pages incl. “Falsklarm” and signal specs
                (msb.se); Krisinformation VMA/Warning-systems pages (krisinformation.se); MSB
                brochure “In case of crisis or war” (rib.msb.se
              </p>
            </div>

            {/* Footer */}
            <footer className="p-6">
              <button className="w-full py-2 px-4 rounded bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition">
                Call to Action
              </button>
            </footer>
          </div>
        )}
      </aside>
    </div>
  );
}

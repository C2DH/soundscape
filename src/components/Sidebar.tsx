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
            <span className="sound-code absolute top-0 right-0">DEN-001</span>
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
                Denmark’s modern siren system was introduced in 1993, replacing a patchwork of
                WWII-era alarms. The design was based on studies carried out by the Danish Emergency
                Management Agency (Beredskabsstyrelsen) in the late 1980s and early 1990s, which
                found that older tones were easily confused with fire brigade calls. To avoid
                confusion, the national standard settled on two core signals: a 45-second rising and
                falling tone (“Varsling” / Gå inden døre – Go indoors) and a 45-second steady tone
                (“Faren er forbi” – The danger is over). The intention was to provide a clear,
                recognizable acoustic pattern that would be both impossible to mistake for other
                uses of sirens and psychologically easy to distinguish between threat and all-clear
                (Beredskabsstyrelsen, siren information page; Wikipedia Warning siren in
                Denmark).\nThe system consists of about 1,000 electronic sirens distributed across
                Danish cities, covering roughly 80 % of the population. The sirens are centrally
                controlled by the national police and can also be triggered locally. Each year on
                the first Wednesday in May at 12:00, a full nationwide test is conducted: first the
                rising/falling “go indoors” warning, then after a pause, the steady “danger over”
                all-clear. This practice reinforces public familiarity and ensures technical
                reliability. Authorities emphasize that when people hear the rising/falling tone,
                they should immediately go indoors, close windows and doors, and seek information
                from DR (Danish Radio) or other official media channels (Beredskabsstyrelsen;
                Wikipedia Warning siren in Denmark).\nSources:\n • Danish Emergency Management
                Agency (Beredskabsstyrelsen), official siren information: beredskabsstyrelsen.dk –
                Sirenerne\n • Wikipedia, Warning siren in Denmark:
                en.wikipedia.org/wiki/Warning_siren_in_Denmark
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

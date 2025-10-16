import TeamMember from '../components/TeamMember';
import { SiteBasename } from '../constants';

interface ContactPage {
  title: string;
  content: string;
}

const imagePrefixSrc = String(SiteBasename.replace(/\/\//g, '/'));

const ContactPage: React.FC = () => {
  return (
    <div className="content w-screen h-screen flex items-center  justify-center absolute top-0 left-0 z-2">
      <div className="Page wrapper  w-screen  pb-[2rem] h-[75vh] overflow-auto flex flex-col items-center ">
        <div className=" flex flex-col align-center px-4">
          <h1 className="text-3xl font-bold text-center">Team</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-8">
            <TeamMember
              image={`${imagePrefixSrc}img/Marie.jpg`}
              title="Marie CRONQVIST (PI)"
              subtitle="Professor of Modern History,
      Linköping University, Sweden"
              href="https://liu.se/en/employee/marcr79"
            />
            <TeamMember
              image={`${imagePrefixSrc}img/Johan.jpg`}
              title="Johan MALMSTEDT"
              subtitle="Ph D and researcher in Media and Communication Studies and Digital Humanities, and affiliate member of the Meta Lab, Harvard University."
              href="https://mlml.io/m/johan-malmstedt/"
            />
            <TeamMember
              image={`${imagePrefixSrc}img/Daniele.jpg`}
              title="Daniele Guido"
              subtitle="Developer, Lead Designer of C²DH, University of Luxembourg"
              href="https://www.uni.lu/c2dh-en/people/daniele-guido/"
            />
            <TeamMember
              className="md:col-start-0 col-start-0"
              image={`${imagePrefixSrc}img/Kirill.jpg`}
              title="Kirill MITSUROV"
              subtitle="Designer / Developer, User Interface Developer of C²DH, University of Luxembourg"
              href="https://www.uni.lu/c2dh-en/people/kirill-mitsurov/"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

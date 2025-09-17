import { useEffect, useState } from 'react';
import TeamMember from '../components/TeamMember';

interface ContactPage {
  title: string;
  content: string;
}

const ContactPage: React.FC = () => {
  const [data, setData] = useState<ContactPage | null>(null);

  useEffect(() => {
    import('../assets/data/pages/about.json').then((json) => {
      setData(json as ContactPage);
    });
  }, []);

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <div className="content w-screen h-screen flex items-center  justify-center absolute top-0 left-0 z-2">
      <div className="wrapper  w-screen  pb-[2rem] h-[75vh] overflow-auto flex flex-col items-center ">
        <div className=" flex flex-col align-center px-4">
          <h1 className="text-3xl font-bold text-center">Team</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-8">
            <TeamMember
              image="/img/Marie.jpg"
              title="Marie CRONQVIST (PI)"
              subtitle="Professor of Modern History,
      Linköping University, Sweden"
              href="https://liu.se/en/employee/marcr79"
            />
            <TeamMember
              image="/img/Johan.jpg"
              title="Jonas LINDSTRÖM"
              subtitle="Ph D and researcher in Media and Communication Studies and Digital Humanities, and affiliate member of the Meta Lab, Harvard University."
              href="https://mlml.io/m/johan-malmstedt/"
            />
            <TeamMember
              image="/img/Daniele.jpg"
              title="Daniele Guido"
              subtitle="Lead Designer"
              href="https://www.uni.lu/c2dh-en/people/daniele-guido/"
            />
            <TeamMember
              className="md:col-start-0 col-start-0"
              image="/img/Kirill.jpg"
              title="Kirill MITSUROV"
              subtitle="User Interface Developer"
              href="https://www.uni.lu/c2dh-en/people/kirill-mitsurov/"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

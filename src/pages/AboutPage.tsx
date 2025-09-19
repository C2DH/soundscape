import data from '../assets/data/pages/about.json';
interface AboutData {
  title: string;
  content: string;
}

const About: React.FC = () => {
  const { title, content } = data as AboutData;

  return (
    <div className="content w-screen h-screen flex items-center justify-center absolute top-0 left-0 z-2">
      <div className="wrapper  w-screen h-[70vh] overflow-auto flex flex-col items-center ">
        <div className="max-w-3xl px-4">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-md font-medium leading-relaxed whitespace-pre-line mt-4">{content}</p>
        </div>
      </div>
    </div>
  );
};

export default About;

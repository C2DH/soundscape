import Button from '../components/Button';

const IndexPage = () => {
  return (
    <div className="absolute w-screen h-auto top-[40vh]  text-center flex flex-col justify-center items-center z-30">
      <h1 className="text-4xl font-semibold max-w-[700px] mb-8">
        The world's most complete collection of warning sounds
      </h1>
      <Button link="/overview" label="Dicover Soundscapes" className="top-4 left-4" />
    </div>
  );
};

export default IndexPage;

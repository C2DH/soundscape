import { Link } from 'react-router';

const IndexPage = () => {
  return (
    <div className="absolute w-screen h-screen text-center flex flex-col justify-center items-center z-2">
      <h1 className="text-4xl font-semibold max-w-[700px] my-8 pt-12 uppercase">
        The world's most complete collection of warning sounds
      </h1>
      <Link to="/overview" className="top-4 left-4 link-button">
        Discover Soundscapes
      </Link>
    </div>
  );
};

export default IndexPage;

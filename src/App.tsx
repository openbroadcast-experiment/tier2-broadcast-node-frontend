import { FC, startTransition, useEffect, useState } from 'react';
import { atom, selectorFamily, useRecoilState, useRecoilValue } from 'recoil';
import axios from 'axios';
import './App.css';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';

const BASE_URL = 'http://127.0.0.1';

//TODO Fix any below
interface NodeData {
  [key: string]: any;
}

interface FormData {
  topic: string;
  message: string;
}
// Set to a value to force all nodes on this page to refresh
const refreshIdAtom = atom<string>({
  key: 'nodeRefreshId',
  default: uuidv4(),
});


interface SubscribeForm {
  topic: string;
  message: string;
}
interface PublishForm {
  topic: string;
  message: string;
}

const Tier2NodeStats: FC<{ port: number }> = ({ port }) => {
  const [nodeData, setNodeData] = useState<NodeData>({});
  const { register: registerSubscribe, handleSubmit: handleSubmitSubscribe, reset: resetSubscribe, formState: { errors: errorsSubscribe } } = useForm<PublishForm>();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PublishForm>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${BASE_URL}:${port}/p2p/node`);
      response.data.config = '...';
      setNodeData(response.data);
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, [port]);

  const subscribe = async (data: SubscribeForm) => {
    try {
      await axios.post(`${BASE_URL}:${port}/p2p/subscribe`, { topic: data.topic });
      reset();
    } catch (error) {
      console.error('Error subscribing:', error);
    }
  };

  const publish = async (data: PublishForm) => {
    try {
      await axios.post(`${BASE_URL}:${port}/p2p/publish`, { topic: data.topic, message: data.message });
      reset();
    } catch (error) {
      console.error('Error publishing:', error);
    }
  };

  return (
    <div className="App">
      <h3>Node {port}</h3>
      <form onSubmit={handleSubmit(publish)}>
        <div className="container">
          <input type="text" placeholder="Topic to publish" {...register('topic', { required: true })} />
          {errors.topic && <p>This field is required</p>}
          <input type="text" placeholder="Message to publish" {...register('message', { required: true })} />
          {errors.message && <p>This field is required</p>}
          <button type="submit">Publish</button>
        </div>
      </form>

      <form onSubmit={handleSubmitSubscribe(subscribe)}>
        <div className="container">
          <input type="text" placeholder="Topic to subscribe" {...registerSubscribe('topic', { required: true })} />
          {errorsSubscribe.topic && <p>This field is required</p>}
          <button type="submit">Subscribe</button>
        </div>
      </form>

      <div className="container">
        <textarea readOnly value={JSON.stringify(nodeData, null, 2)}></textarea>
      </div>
    </div>
  );
};

function App() {
  const [_, setRefreshId] = useRecoilState(refreshIdAtom);
  //Refresh all nodes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      startTransition(() => setRefreshId(uuidv4()))
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <h1>Node dashboard</h1>
      <Tier2NodeStats port={8080} />
      <Tier2NodeStats port={8081} />
    </>
  );
}

export default App;
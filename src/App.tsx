import { startTransition, useEffect } from 'react';
import { atom, useRecoilState } from 'recoil';
import { v4 as uuidv4 } from 'uuid';
import { Tier2NodeStats } from "./components/Tier2NodeStats.tsx";
import './index.tsx';

// Set to a value to force all nodes on this page to refresh
const refreshIdAtom = atom<string>({
  key: 'nodeRefreshId',
  default: uuidv4(),
});

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
      <h1 className="font-extrabold ml-10 ">NODE DASHBOARD</h1>

      <div style={{ alignContent: "center" }}>
        <Tier2NodeStats port={8080} />
        <Tier2NodeStats port={8081} /></div>
    </>
  );
}

export default App;
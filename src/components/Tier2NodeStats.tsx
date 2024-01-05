import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactJson from '@microlink/react-json-view';
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { CardComponent } from "./CardComponent.tsx";
import { ConnectionsTable } from "./ConnectionsTable.tsx";
import { List } from "./List.tsx";
import { SubscribersTable } from "./SubscribersTable.tsx";
import { EventHistoryTable } from "./EventHistoryTable.tsx";

const BASE_URL = 'http://127.0.0.1';

//TODO Fix any below
interface NodeData {
    [key: string]: any;
}

interface SubscribeForm {
    topic: string;
    message: string;
}
interface PublishForm {
    topic: string;
    message: string;
}

export const Tier2NodeStats: FC<{ port: number }> = ({ port }) => {
    const [nodeData, setNodeData] = useState<NodeData>({});
    const { register: registerSubscribe, handleSubmit: handleSubmitSubscribe, reset: resetSubscribe, formState: { errors: errorsSubscribe } } = useForm<PublishForm>();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<PublishForm>();

    const [showNode, setShowNode] =
        useState(true);

    const [showNodeStatusRaw, setShowNodeStatusRaw] =
        useState(false);

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

    const subscribers = nodeData.subscribers === undefined ? [] : Object.keys(nodeData.subscribers).map(d => {
        return {
            name: d,
            peers: nodeData.subscribers[d]
        }
    })

    return (
        <div className="App mt-5">

            <div className="mb-5" style={{ display: "flex", alignItems: "center" }}>
                <h3 className="ml-10">Node {port}</h3>
                <Button variant="outline" className="rounded-full ml-5 w-32"
                    onClick={() =>
                        setShowNode(!showNode)
                    }
                >
                    {showNode ? "Hide" : "Show"} Node

                </Button>
            </div>

            {showNode && (
                <>
                    <div style={{ display: "flex", alignItems: "end" }}>
                        <form onSubmit={handleSubmit(publish)}>
                            <div className="container">
                                <Input type="text" className="w-96 m-2" placeholder="Topic to publish" {...register('topic', { required: true })} />
                                {errors.topic && <p>This field is required</p>}
                                <Input type="text" className="w-96 m-2" w-md placeholder="Message to publish" {...register('message', { required: true })} />
                                {errors.message && <p>This field is required</p>}
                                <Button className="m-2" variant="outline" type="submit">Publish</Button>
                            </div>
                        </form>

                        <form onSubmit={handleSubmitSubscribe(subscribe)}>
                            <div className="container">
                                <Input type="text" className="w-96 m-2" placeholder="Topic to subscribe" {...registerSubscribe('topic', { required: true })} />
                                {errorsSubscribe.topic && <p>This field is required</p>}
                                <Button className="m-2" variant="outline" type="submit">Subscribe</Button>
                            </div>
                        </form></div>

                    <div className="container">

                        <div style={{ display: "flex", alignItems: "end" }}>
                            <CardComponent title="LibP2Peers">
                                <List data={nodeData.libp2pPeers} />
                            </CardComponent>
                            <CardComponent title="Listen Addresses">
                                <List data={nodeData.listenAddresses} />
                            </CardComponent>
                            <CardComponent className="m-2 h-72 w-full rounded-md border" title="Subscribers">
                                <SubscribersTable subscribersData={subscribers} />
                            </CardComponent>
                        </div>

                        <CardComponent className="m-2 w-full rounded-md border" title="Events History">
                            <EventHistoryTable eventHistoryData={nodeData.eventHistory?.array || []} />
                        </CardComponent>
                        <CardComponent className="m-2 w-full rounded-md border" title="Connections">
                            <ConnectionsTable connectionsData={nodeData.connections} />
                        </CardComponent>

                        <Button className="m-2" variant="outline"
                            onClick={() =>
                                setShowNodeStatusRaw(!showNodeStatusRaw)
                            }
                        >
                            {showNodeStatusRaw ? "HIDE" : "SHOW"} RAW JSON
                        </Button>

                        {showNodeStatusRaw && (
                            <div className="gap-5 p-5" style={{ width: "1000px" }}>
                                <ReactJson src={nodeData} theme="monokai" />
                            </div>
                        )}
                    </div>
                </>
            )
            }
        </div >
    );
};

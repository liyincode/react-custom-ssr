import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "./api";

function Home() {
    const { data } = useQuery({
        queryKey: ["home-data"],
        queryFn: () => api.getHomeData()
    });

    return (
        <div className="container">
            <h1>{data?.title}</h1>
            <p>{data?.description}</p>
            {data?.features && (
                <ul>
                    {data.features.map((feature: string, index: number) => (
                        <li key={index}>{feature}</li>
                    ))}
                </ul>
            )}
            {data?.stats && (
                <div>
                    <p>Users: {data.stats.totalUsers}</p>
                    <p>Posts: {data.stats.totalPosts}</p>
                    <p>Views: {data.stats.totalViews}</p>
                </div>
            )}
            
            <hr />
            <h2>Example Posts</h2>
            <p>Click the links below to test dynamic routing:</p>
            <ul>
                <li><Link to="/post/1">Post 1: Understanding Server-Side Rendering</Link></li>
                <li><Link to="/post/2">Post 2: Modern CSS Best Practices</Link></li>
                <li><Link to="/post/999">Post 999 (Not Found)</Link></li>
            </ul>
        </div>
    );
}

export default Home;

import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "./api";

function Post() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const { data, isLoading, error } = useQuery({
        queryKey: ["post", id],
        queryFn: () => api.getPostById(id!),
        enabled: !!id,
    });

    if (isLoading) {
        return <div>Loading post...</div>;
    }

    if (error) {
        return <div>Failed to load post</div>;
    }

    if (!data) {
        return <div>Post not found</div>;
    }

    return (
        <div className="container">
            <a
                href="#"
                onClick={(e) => { e.preventDefault(); navigate(-1); }}
                style={{ display: 'inline-block', marginBottom: '20px', textDecoration: 'underline', color: 'inherit' }}
            >
                ← Back
            </a>
            <h1>{data.title}</h1>
            <p className="meta">
                Author: {data.author} | Published at: {data.publishDate}
            </p>
            <div className="content">
                {data.content}
            </div>
            {data.tags && (
                <div className="tags">
                    <strong>Tags:</strong>
                    {data.tags.map((tag: string, index: number) => (
                        <span key={index} className="tag"> {tag}</span>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Post;

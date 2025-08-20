const baseUrl = "http://localhost:8007";

export const api = {
  getHomeData: () => fetch(`${baseUrl}/home`).then(res => res.json()),
  getPostById: (id: string) => fetch(`${baseUrl}/posts/${id}`).then(res => res.json())
};

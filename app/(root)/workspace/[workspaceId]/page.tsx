"use client";

const WorkspaceDetail = ({ params }: { params: { workspaceId: string } }) => {
  return <div>{params.workspaceId}</div>;
};

export default WorkspaceDetail;

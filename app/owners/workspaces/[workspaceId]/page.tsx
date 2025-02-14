"use client";

import { useParams } from "next/navigation";

function WorkspaceDetail() {
  const { workspaceId } = useParams() as { workspaceId: string };
  return (
    <div className="p-4 bg-white rounded-xl">
      Workspace detail {workspaceId}
    </div>
  );
}

export default WorkspaceDetail;

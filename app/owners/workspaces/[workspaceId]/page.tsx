"use client";

import WorkspaceForm from "@/components/owner-form/WorkspaceForm";
import { workspaceList } from "@/constants/constant";
import { WorkspaceProps } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function WorkspaceDetail() {
  const { workspaceId } = useParams() as { workspaceId: string };
  const [workspaceDetail, setWorkspaceDetail] = useState<WorkspaceProps | null>(
    null
  );

  useEffect(() => {
    if (workspaceId) {
      setWorkspaceDetail(workspaceList[Number.parseInt(workspaceId) - 1]);
    }
  }, [workspaceId]);

  return (
    <div className="p-4 bg-white rounded-xl">
      <WorkspaceForm initialData={workspaceDetail} />
    </div>
  );
}

export default WorkspaceDetail;

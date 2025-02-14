import WorkspaceTable from "@/components/table/workspace-table";
import { workspaceList } from "@/constants/constant";
import { WorkspaceTableColumns } from "@/constants/table-columns";

function WorkspaceManagement() {
  return (
    <div className="p-4 bg-white rounded-xl">
      <WorkspaceTable columns={WorkspaceTableColumns} data={workspaceList} />
    </div>
  );
}

export default WorkspaceManagement;

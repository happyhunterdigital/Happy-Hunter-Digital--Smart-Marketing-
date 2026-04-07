import React from 'react';

interface WorkspaceViewProps {
  workspaceTasks: any[];
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({ workspaceTasks }) => (
  <div className="max-w-7xl mx-auto animate-fade-in">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-black border border-gray-800 p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
        <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">Total System Nodes</h3>
        <p className="text-4xl font-black text-white">{workspaceTasks.length}</p>
      </div>
      <div className="bg-black border border-gray-800 p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
        <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">To Do</h3>
        <p className="text-4xl font-black text-blue-500">{workspaceTasks.filter(t => t.status === 'To Do').length}</p>
      </div>
      <div className="bg-black border border-gray-800 p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
        <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">Active (WIP)</h3>
        <p className="text-4xl font-black text-orange-500">{workspaceTasks.filter(t => t.status === 'In Progress').length}</p>
      </div>
      <div className="bg-black border border-gray-800 p-6 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
        <h3 className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">Verified (Done)</h3>
        <p className="text-4xl font-black text-green-500">{workspaceTasks.filter(t => t.status === 'Done').length}</p>
      </div>
    </div>

    <div className="bg-black border border-gray-800 rounded-3xl overflow-hidden shadow-2xl relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0a0a0a] border-b border-gray-800 text-gray-500 text-[10px] font-black uppercase tracking-widest">
              <th className="p-5">Task Objective</th>
              <th className="p-5">Strategic Status</th>
              <th className="p-5">Resource Assigned</th>
              <th className="p-5">Timeline</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 text-sm">
            {workspaceTasks.length === 0 ? (
              <tr><td colSpan={4} className="p-10 text-center text-gray-500 font-mono">Mission control is currently idle. No active tasks.</td></tr>
            ) : (
              workspaceTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-900/50 transition-colors">
                  <td className="p-5 font-bold text-white uppercase tracking-tight">{task.title}</td>
                  <td className="p-5">
                    <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${
                      task.status === 'Done' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                      task.status === 'In Progress' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                      'bg-blue-500/10 text-blue-500 border-blue-500/20'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="p-5 text-gray-400 font-bold uppercase text-xs">{task.assignee}</td>
                  <td className="p-5 text-gray-500 text-xs font-mono lowercase">{task.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

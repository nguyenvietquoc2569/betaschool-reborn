import React from "react";

type MatchGroupProps = {
  groupName: string;
  teams: string[];
};

export const MatchGroup: React.FC<MatchGroupProps> = ({ groupName, teams }) => {
  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-2xl p-4 mb-6">
      <h2 className="text-xl font-bold mb-4 text-center text-blue-600">
        {groupName}
      </h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-100">
            <th className="text-left p-2 border-b">#</th>
            <th className="text-left p-2 border-b">Tên đội</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, index) => (
            <tr key={index} className="hover:bg-blue-50">
              <td className="p-2 border-b">{index + 1}</td>
              <td className="p-2 border-b">{team}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};



import CampaginType from "./CampaginType";

function MaintenanceTable({ campaignsDetails }) {
  return (
    <table className="maintenance-table">
      <thead>
        <tr>
          <th>Maintenance Fee</th>
          <th>Active</th>
          <th>Cost</th>
          <th>Total Cost</th>
        </tr>
      </thead>
      <tbody>
        {campaignsDetails.map((item, index) => (
          <CampaginType
            key={index} // or consider adding an `id` to item if you have one
            type={item.type}
            costPerMonth={item.costPerMonth}
            numAccounts={item.numAccounts}
          />
        ))}
      </tbody>
    </table>
  );
}

export default MaintenanceTable;

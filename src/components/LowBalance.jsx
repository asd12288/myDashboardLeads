function LowBalance({ remainingBudget }) {
  return (
    <div className="low-balance">
      <p>
        Analyzing your funding history, our system detected that you will run
        out of funds in the next couple of days.
      </p>
      <p>Remaining Budget: {remainingBudget}</p>
      <p>
        <span>Fund your account so your campaigns will stay active!</span>
      </p>
    </div>
  );
}

export default LowBalance;

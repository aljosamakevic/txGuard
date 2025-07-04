export const parseSimulationResult = (result) => {
  if (!result || !result.transaction || !result.simulation) return null;

  const { transaction, simulation } = result;
  //   const callTrace = transaction.transaction_info?.call_trace;
  const assertTransfer = transaction.transaction_info?.asset_changes?.[0];

  return {
    success: simulation.status,
    gasUsed: simulation.gas_used,
    from: transaction.from,
    to: transaction.to,
    functionSelector: transaction.function_selector || "transfer",
    value: assertTransfer?.raw_amount || null,
    tokenSymbol: assertTransfer?.token_info?.symbol || "",
    dashboardUrl: `https://dashboard.tenderly.co/${simulation.owner_id}/simulator/${simulation.id}`,
  };
};

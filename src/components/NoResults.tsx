function NoResults({ workType = "projects" }: { workType?: string }) {
	return (
		<div className="tight-container">
			<p>No {workType} match your filters.</p>
		</div>
	);
}

NoResults.displayName = "NoResults";

export default NoResults;

import styles from "./NoResults.module.css";

function NoResults({ workType = "projects" }: { workType?: string }) {
	return (
		<div className={`tight-container ${styles.root}`}>
			<p>No {workType} match your filters.</p>
		</div>
	);
}

NoResults.displayName = "NoResults";

export default NoResults;

<template>
	<div
		class="big"
		style="
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
		"
	>
		<div
			class="ui card"
			style="background: whitesmoke; width: 75%; height: 600px; padding: 20px"
		>
			<div class="content" style="overflow-y: auto">
				<b><div v-html="displayScript"></div></b>
			</div>
		</div>
	</div>
</template>

<script>
	// import axios from "axios";
	export default {

		props: ["scriptText"],
		data() {
			return {};
			// return {
			// 	scriptText:
			// 		"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptates itaque beatae quas perspiciatis blanditiis voluptatibus sunt quo et perferendis natus maxime deserunt veniam nihil corporis, eius fugiat officia vitae. Ducimus quo hic fuga architecto voluptate totam consequatur, dolorem",
			// };
		},
		computed: {
			displayScript() {
				return this.scriptText;
			},
		},
	};
</script>

<style>
	.big {
		width: 100%;
	}
</style>
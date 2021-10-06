<template>
	<div class="big" style="display: flex; justify-content: center; align-items:center; height: 100%">
		<div
			class="ui card"
			style="background: whitesmoke; width: 75%; height: 600px; padding: 20px;"
		>
			<div class="content"  style="overflow-y: auto">
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
		methods: {
			// async getData() {
			// 	console.log("Waiting...");
			// 	try {
			// 		const res = axios.get("http://127.0.0.1:8000/");
			// 		const response = (await res).data;
			// 		for (const each of response) {
			// 			let rawText = JSON.stringify(each.script).replace(
			// 				/(\\r)*\\n/g,
			// 				"<br>"
			// 			);
			// 			// let evenRawerText = JSON.parse(rawText);
			// 			this.scriptText = JSON.parse(rawText);
			// 		}
			// 	} catch (err) {
			// 		console.log(err);
			// 	}
			// },
		},
	};
</script>

<style>
	.big {
		width: 100%;
	}
</style>
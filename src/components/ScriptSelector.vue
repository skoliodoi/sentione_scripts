<template>
	<div>
		<div
			class="ui search selection clearable selection dropdown"
			ref="selector"
			style="width: 300px"
		>
			<input type="hidden" name="language" value="english" />
			<i class="dropdown icon"></i>
			<div class="default text">{{ label }}</div>
			<div class="menu">
				<div
					class="item"
					v-for="each in data"
					:key="each"
					@click="selectScript(each)"
				>
					{{ each }}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: ["data", "label","savedData"],
		data() {
			return {
				showDropdown: false,
			};
		},
		mounted() {
			$(this.$refs.selector).dropdown();
		},
		methods: {
			selectScript(data) {
				this.$emit("scriptSelected", data);
			},
			clearSelection() {
				$(this.$refs.selector).dropdown('clear');
			},
		},
	};
</script>

<style>
</style>
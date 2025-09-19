<template>
	<div class="side-menu">
		<ul>
			<li>
				<router-link to="/">等额本金</router-link>
			</li>
			<li>
				<router-link to="/AverageInterest">等额本息</router-link>
			</li>
			<li>
				<router-link to="/Compare">等额本息等额本金对比</router-link>
			</li>
			<li>Find it on GitHub</li>
		</ul>
	</div>
</template>

<script>
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
	@import '../common/reset.css';
	.side-menu {
		color: #000;
		ul {
			display: flex;
			flex-direction: column;
			width: 200px;
			margin-left: 10px;
			text-align: left;
			li {
				margin: 5px 0;
				transition: all 0.5s;
				cursor: pointer;
				&:hover {
					margin-left: 5px;
				}
				a {
					transition: all 0.5s;
					&:visited {
						color: #000;
					}
					&:hover {
						color: #0091ff;
					}
					&.router-link-exact-active {
						color: #0091ff;
					}
				}
			}
		}
	}
</style>

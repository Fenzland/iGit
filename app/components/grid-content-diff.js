
const template= /*HTML*/`
<section :class="{ 'grid-item':true, 'content-diff':true, 'scroll-container':true, focus:focused, }">
	content-diff
</section>
`;

export default {
	template,
	
	props: {
		focused: {
			type: Boolean,
			default: false,
		},
	},
	
	data: ()=> ({}),
};

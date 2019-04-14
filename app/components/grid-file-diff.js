
const template= /*HTML*/`
<section :class="{ 'grid-item':true, 'file-diff':true, 'scroll-container':true, focus:focused, }">
	file-diff
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

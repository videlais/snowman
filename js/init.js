$(document).ready(function()
{
	window.story = new Story($('*[data-role="twinestory"]'));

	$('body').on('click', 'a[data-passage]', function()
	{
		window.story.show($(this).attr('data-passage'));
	});
});

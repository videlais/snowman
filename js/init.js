$(document).ready(function()
{
	window.story = new Story($('*[data-role="twinestory"]'));
	window.story.show(window.story.startPassage);

	$('body').on('click', 'a[data-passage]', function()
	{
		window.story.show($(this).attr('data-passage'));
	});
});

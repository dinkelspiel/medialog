<script>
    function share(text) {
        // Check if Web Share is available
        let inviteButton = document.getElementById("invite-friends");
        if (navigator.share) {
            navigator.share({
                text: text,
                // you can also add url, title, etc.
            }).then(() => {
                inviteButton.innerHTML = 'Sharing successful.';
            }).catch((error) => {
                inviteButton.innerHTML = 'Sharing failed: ' + error;
            });
        } else {
            // Fallback for desktop or browsers that don't support the Web Share API
            navigator.clipboard.writeText(text).then(() => {
                inviteButton.innerHTML = 'Copied to clipboard';
            }).catch(err => {
                inviteButton.innerHTML = 'Failed to copy text: ' + err;
            });
        }
    }
</script>
<x-button.secondary id="invite-friends"
    onclick="share(location.protocol + '//' + location.host + '/invite/{{ auth()->user()->id }}')">
    <x-icons.envelope />
    Invite Friends
</x-button.secondary>

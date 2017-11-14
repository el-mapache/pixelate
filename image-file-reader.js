(function(root) {
	root.pixler = root.pixler || {};

	function onDataLoad(dataLoadEvent) {
		return new Promise((resolve, reject) => {
			const { target } = dataLoadEvent;
			const img = new Image();

			img.addEventListener('load', loadEvent => resolve(loadEvent.target));
			img.addEventListener('error', errEvent => reject(errEvent));

			img.src = target.result;
		});
	}

  function readFile(fileEvent) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.addEventListener('load', async function(e) {
				const fileUrl = await onDataLoad(e);
				return resolve(fileUrl);
			});

			reader.readAsDataURL(fileEvent.target.files[0]);
		});
  }

	root.pixler.readFile = readFile;
})(window);

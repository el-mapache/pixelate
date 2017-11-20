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
		const { files } = fileEvent.target;

		if (!files.length) {
			return;
		}

		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.addEventListener('load', function(e) {
				const fileUrl = onDataLoad(e);
				return resolve(fileUrl);
			});

			reader.readAsDataURL(files[0]);
		});
  }

	root.pixler.readFile = readFile;
})(window);

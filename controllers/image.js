const getClarifaiRequestOptions = (imageUrl) => {

  const PAT = process.env.CLARIFAI_API;
  const USER_ID = 'seppe_peelman';
  const APP_ID = 'test';
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
    },
    "inputs": [
    {
      "data": {
        "image": {
          "url": IMAGE_URL
        }
      }
    }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
    },
    body: raw
  };

  return requestOptions;
}

const imageApiHandler = (req, res) => {
	const requestOptions = getClarifaiRequestOptions(req.body.input);
	const MODEL = 'face-detection';
	fetch("https://api.clarifai.com/v2/models/" + MODEL + "/outputs", requestOptions)
	.then(data => data.json())
	.then(data => {
		res.json(data);
	})
	.catch(err => {
		res.status(400).json('Unable to work with api');
	})
}

const imageHandler = (req, res, db) => {
	const { id } = req.body;
	
	return db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0].entries);
	})
	.catch(err => {
		res.status(400).json('Unable to get entries');
	});

	res.status(404).json('no such user');
}

export default { imageHandler, imageApiHandler };
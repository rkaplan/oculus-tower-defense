using UnityEngine;
using System.Collections;

public class SpawnerScript : MonoBehaviour {
	public GameObject enemy;
	float time;
	bool[] spawned;
	public float[] spawnTimes;
	public int[] pathNum;
	public Vector2[][] paths;
	public float[] timeScalars;
	MapLayout[] actualPaths;
	// Use this for initialization
	void Start () {
		paths = new Vector2[2][];
		paths [0] = new Vector2[] {
			new Vector2 (0, 0),
			new Vector2 (5, 0),
			new Vector2 (5, 5),
			new Vector2 (0, 5),
			new Vector2 (0, 10)
		};
		paths [1] = new Vector2[] {
			new Vector2 (0, 0),
			new Vector2 (-5, 0),
			new Vector2 (-5, 5),
			new Vector2 (0, 5),
			new Vector2 (0, 10)
		};
		time = 0;
		spawned = new bool[spawnTimes.Length];
		actualPaths = new MapLayout[paths.Length];
		for (int i = 0; i < paths.Length; i++) {
			MapLayout path = new MapLayout(new Vector3[0]);
			//path.addPoint(enemy.transform.position);
			foreach(Vector2 v2 in paths[i])
			{
				Vector3 v3 = new Vector3(v2.x, enemy.transform.position.y, v2.y);
				path.addPoint(v3);
			}
			actualPaths[i] = path;
		}
	}
	
	// Update is called once per frame
	void Update () {
		time += Time.deltaTime;
		for(int i = 0; i < spawnTimes.Length; i++)
		{
			if(!spawned[i] && spawnTimes[i] < time)
			{
				GameObject en = Instantiate (enemy, enemy.transform.position, Quaternion.identity) as GameObject;
				EnemyScript es = en.GetComponent<EnemyScript>();
				es.setPath(actualPaths[pathNum[i]]);
				es.setTimeScalar(timeScalars[i]);
				spawned[i] = true;
			}
		}
	}
}

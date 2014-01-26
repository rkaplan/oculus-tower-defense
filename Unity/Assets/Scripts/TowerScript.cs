using UnityEngine;
using System.Collections;

public class TowerScript : MonoBehaviour {
	public int maxlife = 4;
	int life;
	// Use this for initialization
	Color startColor;
	Color endColor;
	void Start () {
		startColor = new Color (0.3f, 1, 0.3f);
		endColor = new Color (0.3f, 1, 0.3f);
		renderer.material.color = startColor;
		life = maxlife;
	}
	
	// Update is called once per frame
	void Update () {
	
	}

	public void onCollisionEnter(Collision c)
	{
		Debug.Log(c.collider.tag);
		if (c.collider.tag == "enemy") {
			life--;
			renderer.material.color = (life / maxlife) * startColor + (1 - life / maxlife) * endColor;
			if(life == 0)
				Destroy (gameObject);
		}
	}
}

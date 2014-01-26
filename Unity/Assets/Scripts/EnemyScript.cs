using UnityEngine;
using System.Collections;

public class EnemyScript : MonoBehaviour {

	public float timeScalar = 0.5f;
	public float timeWindow = 0.01f;
	public float health = 100;
	public MapLayout path;
	public int flashFrames = 5;
	public int damageFrames = 10;
	public float laserDps = 100;
	int damaged;
	float time; 
	bool alive;
	bool lasered;
	int dying;
	Color normalColor;
	Color damageColor;
	// Use this for initialization
	void Start () {
		Renderer r = gameObject.GetComponent<Renderer> ();
		r.material = new Material (Shader.Find ("Transparent/Diffuse"));
		r.material.color = new Color (1, 1, 1, 1);
		normalColor = renderer.material.color;
		damageColor = new Color (1, .3f, .3f);
		time = 0;
		damaged = -1;
		dying = -1;
		lasered = false;
		alive = true;
		if (path == null)
			path = new MapLayout (new Vector3[0]);
	}

	void FixedUpdate() {
		if (lasered)
			damage (laserDps * Time.deltaTime);
		if (alive) 
		{
			if(damaged >= 0)
			{
				if(damaged >= damageFrames)
				{
					damaged = -1;
					renderer.material.color = normalColor;
				}
				else
				{
					damaged++;
					renderer.material.color = damageColor;
				}
			}
			time += Time.deltaTime * timeScalar;
			transform.position = Spline.InterpConstantSpeed (path.getPoints (), time, EasingType.Quadratic, true, true);
			if (time > 0) {
				Vector3 before = Spline.InterpConstantSpeed (path.getPoints (), Mathf.Max (time - timeWindow / 2, 0),
                                     EasingType.Quadratic, true, true);
				Vector3 after = Spline.InterpConstantSpeed (path.getPoints (), Mathf.Max (time + timeWindow / 2, 0),
                                     EasingType.Quadratic, true, true);
				transform.forward = after - before;
			}
		}
		else
		{
			Color c = new Color(damageColor.r,
			                    damageColor.g,
			                    damageColor.b);
			c.a = ((dying / flashFrames) % 2);
			renderer.material.color = c;
			if ((dying / flashFrames) > 3)
				Destroy (gameObject);
			dying++;
		}
	}
	
	public void OnCollisionEnter(Collision collision)
	{
		switch (collision.gameObject.tag) {
		case "laser":
			lasered = true; break;
		case "end":
			break;
		}
	}
	
	public void OnCollisionExit(Collision collision)
	{
		switch (collision.gameObject.tag) {
		case "laser":
			lasered = false; break;
		case "end":
			break;
		}
	}

	public void explode()
	{
		die();
	}

	public void die()
	{
		if (alive) {
			alive = false;
			dying = 0;
		}
	}

	public void damage(float amount)
	{
		health -= amount;
		damaged = 0;
		if (health < 0)
			die();
	}

	public void setTimeScalar(float ts)
	{
		timeScalar = ts;
	}

	public void setPath(MapLayout m)
	{
		path = m;
	}
}
